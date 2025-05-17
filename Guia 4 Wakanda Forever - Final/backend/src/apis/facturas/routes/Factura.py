from flask import Blueprint, jsonify, request
from ..models.FacturasModels import FacturaModel
from ..models.entities.Facturas import Factura
from apis.notificaciones.models.NotificacionesModels import NotificacionModel
from apis.notificaciones.models.entities.Notificaciones import Notificacion
from apis.citas.models.CitasModels import CitaModel
from apis.pacientes.models.PacientesModels import PacienteModel
from services.twilio_service import enviar_whatsapp

import uuid
from datetime import datetime

main = Blueprint("Factura_blueprint", __name__)

@main.route('/', methods=['GET'])
def get_facturas():
    try:
        facturas = FacturaModel.get_all_facturas()
        return jsonify({
            "success": True,
            "message": "Lista de facturas",
            "data": facturas,
            "count": len(facturas)
        }), 200
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/<id_factura>', methods=['GET'])
def get_factura_by_id(id_factura):
    try:
        factura = FacturaModel.get_by_id(id_factura)
        if factura:
            return jsonify({"success": True, "message": "Factura encontrada!", "data": factura}), 200
        return jsonify({"success": False, "message": "Factura no encontrada"}), 404
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/add', methods=['POST'])
def add_factura():
    try:
        data = request.get_json()
        
        required_fields = ['cita_id', 'numero_factura', 'nit_paciente', 'subtotal', 'iva']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                "success": False,
                "error": f"Faltan campos: {', '.join(missing_fields)}"
            }), 400

        factura = Factura(
            id_factura=str(uuid.uuid4()),
            cita_id=data['cita_id'],
            numero_factura=data['numero_factura'],
            fecha_emision=data.get('fecha_emision'),  # Se puede omitir si no se proporciona
            nit_paciente=data['nit_paciente'],
            subtotal=data['subtotal'],
            iva=data['iva']
        )
        
        affected_rows = FacturaModel.add(factura)
        if affected_rows == 1:
            return jsonify({
                "success": True,
                "message": "Factura generada",
                "id": factura.id_factura
            }), 201
            
        return jsonify({"success": False, "error": "No se generó factura"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/update/<id_factura>', methods=['PUT'])
def update_factura(id_factura):
    try:
        data = request.get_json()
        
        # 1. Verificar que la factura existe
        existing_factura = FacturaModel.get_by_id(id_factura)
        if not existing_factura:
            return jsonify({"success": False, "message": "Factura no encontrada"}), 404

        # 2. Validación de campos
        required_fields = ['numero_factura', 'nit_paciente', 'subtotal', 'iva']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                "success": False,
                "error": f"Faltan campos: {', '.join(missing_fields)}"
            }), 400

        if not data['numero_factura'].startswith('FACT-'):
            return jsonify({
                "success": False,
                "error": "El número de factura debe comenzar con 'FACT-'"
            }), 400

        if float(data['subtotal']) <= 0 or float(data['iva']) < 0:
            return jsonify({
                "success": False,
                "error": "El subtotal debe ser positivo y el IVA no negativo"
            }), 400

        # 3. Manejo seguro de fechas
        try:
            fecha_emision = (
                datetime.strptime(existing_factura['fecha_emision'], '%Y-%m-%d').date()
                if isinstance(existing_factura['fecha_emision'], str)
                else existing_factura['fecha_emision']
            )
        except (ValueError, AttributeError):
            fecha_emision = datetime.now().date()

        # 4. Actualizar factura
        factura = Factura(
            id_factura=id_factura,
            cita_id=existing_factura['cita_id'],
            numero_factura=data['numero_factura'],
            fecha_emision=fecha_emision,
            nit_paciente=data['nit_paciente'],
            subtotal=data['subtotal'],
            iva=data['iva']
        )
        
        affected_rows = FacturaModel.update(factura)
        if affected_rows != 1:
            return jsonify({"success": False, "error": "No se pudo actualizar la factura"}), 400

        # 5. Notificación al paciente
        try:
            cita = CitaModel.get_by_id(existing_factura['cita_id'])
            if not cita:
                raise ValueError("Cita asociada no encontrada")
                
            paciente = PacienteModel.get_by_id(cita['paciente_id'])
            if not paciente:
                raise ValueError("Paciente no encontrado")

            # Formatear mensaje
            total = float(data['subtotal']) + float(data['iva'])
            mensaje = f"""
            🧾 Actualización de Factura 🧾
            Número: {data['numero_factura']}
            Fecha: {fecha_emision.strftime('%d/%m/%Y')}
            Total: ${total:.2f}
            Estado: {"PAGADA" if total == 0 else "PENDIENTE"}
            """

            # Enviar WhatsApp
            telefono = paciente['telefono'].replace('-', '')
            if not telefono.startswith('+'):
                telefono = f"+503{telefono}"  # Codigo para El Salvador
                
            estado_envio = enviar_whatsapp(telefono, mensaje)

            # Registrar notificación
            NotificacionModel.add(Notificacion(
                id_notificacion=str(uuid.uuid4()),
                cita_id=existing_factura['cita_id'],
                tipo="whatsapp",
                contenido=mensaje,
                estado=estado_envio
            ))

            return jsonify({
                "success": True,
                "message": "Factura actualizada y notificación enviada",
                "total": total,
                "notificacion_status": estado_envio
            }), 200

        except Exception as notif_error:
            # Si falla la notificación pero la factura se actualizó
            return jsonify({
                "success": True,
                "message": "Factura actualizada pero falló la notificación",
                "error": str(notif_error)
            }), 200

    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500

@main.route('/delete/<id_factura>', methods=['DELETE'])
def delete_factura(id_factura):
    try:
        affected_rows = FacturaModel.delete(id_factura)
        if affected_rows == 1:
            return jsonify({"success": True, "message": "Factura anulada"}), 200
        return jsonify({"success": False, "error": "No se anuló"}), 400
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500