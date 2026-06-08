package com.electrokiosco.DTO;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PedidoResponseDTO {

    private Long id;
    private LocalDateTime fecha;
    private Double total;
    private String estado;
    private String metodoPago;

    private List<DetalleResponseDTO> detalles;

    @Data
    public static class DetalleResponseDTO {
        private String producto;
        private Integer cantidad;
        private Double precioUnitario;
        private Double subtotal;
    }
}