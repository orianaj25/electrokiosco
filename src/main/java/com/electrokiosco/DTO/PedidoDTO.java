package com.electrokiosco.DTO;

import java.util.List;

public class PedidoDTO {

    private List<ItemPedidoDTO> items;

    public List<ItemPedidoDTO> getItems() {
        return items;
    }

    public void setItems(List<ItemPedidoDTO> items) {
        this.items = items;
    }

    private String metodoPago;

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }
    // getters y setters
}