package com.electrokiosco.service;

import com.electrokiosco.DTO.ItemPedidoDTO;
import com.electrokiosco.DTO.PedidoDTO;
import com.electrokiosco.DTO.PedidoResponseDTO;
import com.electrokiosco.model.DetallePedido;
import com.electrokiosco.model.Pedido;
import com.electrokiosco.model.Producto;
import com.electrokiosco.repository.PedidoRepository;
import com.electrokiosco.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    public Pedido crearPedido(PedidoDTO dto){

        System.out.println("=== CREANDO PEDIDO ===");

        Pedido pedido = new Pedido();
        pedido.setFecha(LocalDateTime.now());
        pedido.setEstado("PENDIENTE");

        List<DetallePedido> detalles = new ArrayList<>();

        double total = 0;

        for(ItemPedidoDTO item : dto.getItems()){

            System.out.println("Producto ID: " + item.getProductoId());

            Producto producto = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            DetallePedido detalle = new DetallePedido();

            detalle.setProducto(producto);
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecio());

            // IMPORTANTE
            detalle.setPedido(pedido);

            detalles.add(detalle);

            total += producto.getPrecio() * item.getCantidad();
        }

        // IMPORTANTE
        pedido.setDetalles(detalles);

        pedido.setTotal(total);

        return pedidoRepository.saveAndFlush(pedido);
    }
    public List<PedidoResponseDTO> obtenerPedidosParaAdmin(){

        List<Pedido> pedidos = pedidoRepository.findAll();

        List<PedidoResponseDTO> respuesta = new ArrayList<>();

        for(Pedido pedido : pedidos){

            PedidoResponseDTO dto = new PedidoResponseDTO();
            dto.setId(pedido.getId());
            dto.setFecha(pedido.getFecha());
            dto.setTotal(pedido.getTotal());
            dto.setEstado(pedido.getEstado());

            List<PedidoResponseDTO.DetalleResponseDTO> detallesDTO = new ArrayList<>();

            for(DetallePedido det : pedido.getDetalles()){

                PedidoResponseDTO.DetalleResponseDTO d = new PedidoResponseDTO.DetalleResponseDTO();

                d.setProducto(det.getProducto().getNombre());
                d.setCantidad(det.getCantidad());
                d.setPrecioUnitario(det.getPrecioUnitario());
                d.setSubtotal(det.getCantidad() * det.getPrecioUnitario());

                detallesDTO.add(d);
            }

            dto.setDetalles(detallesDTO);
            respuesta.add(dto);
        }

        return respuesta;
    }

    public void cambiarEstado(Long id, String estado){
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        pedido.setEstado(estado);  // Actualiza el estado
        pedidoRepository.save(pedido);  // Guarda el pedido con el nuevo estado
    }
}
