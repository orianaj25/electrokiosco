package com.electrokiosco.controller;

import com.electrokiosco.DTO.PedidoDTO;
import com.electrokiosco.DTO.PedidoResponseDTO;
import com.electrokiosco.model.Pedido;
import com.electrokiosco.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedidos")
@CrossOrigin("*")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping
    public Pedido crearPedido(@RequestBody PedidoDTO dto){
        return pedidoService.crearPedido(dto);
    }

    @GetMapping("/admin")
    public List<PedidoResponseDTO> listarPedidosAdmin(){
        return pedidoService.obtenerPedidosParaAdmin();
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Void> cambiarEstado(@PathVariable Long id, @RequestParam String estado){
        pedidoService.cambiarEstado(id, estado);  // Llamada al servicio para cambiar el estado
        return ResponseEntity.ok().build();  // Respuesta exitosa
    }
}
