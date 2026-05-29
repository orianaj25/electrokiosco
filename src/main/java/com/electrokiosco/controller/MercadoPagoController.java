package com.electrokiosco.controller;

import com.electrokiosco.model.Pedido;
import com.electrokiosco.repository.PedidoRepository;
import com.electrokiosco.service.MercadoPagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/mercadopago")
@CrossOrigin("*")
public class MercadoPagoController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private MercadoPagoService mercadoPagoService;

    // =========================
    // CREAR PREFERENCIA
    // ==============|z===========
    @PostMapping("/crear-preferencia")
    public Map<String, String> crearPreferencia(
            @RequestBody Pedido pedido
    ) {

        try {

            Pedido pedidoGuardado =
                    pedidoRepository.findById(pedido.getId())
                            .orElseThrow();

            String url =
                    mercadoPagoService
                            .crearPreferencia(pedidoGuardado);

            return Map.of(
                    "url", url
            );

        } catch (Exception e) {

            e.printStackTrace();

            return Map.of(
                    "error",
                    "Error al crear preferencia"
            );
        }
    }

    // =========================
    // PAGO EXITOSO
    // =========================
    @GetMapping("/pago-exitoso")
    public String pagoExitoso(
            @RequestParam("external_reference") String pedidoId
    ) {

        System.out.println("========== PAGO EXITOSO ==========");
        System.out.println("Pedido recibido: " + pedidoId);

        Pedido pedido =
                pedidoRepository
                        .findById(Long.parseLong(pedidoId))
                        .orElseThrow();

        System.out.println("Estado antes: " + pedido.getEstado());

        pedido.setEstado("PAGADO");

        pedidoRepository.save(pedido);

        System.out.println("Estado después: " + pedido.getEstado());

        return "Pago realizado correctamente";
    }

    // =========================
    // PAGO FALLIDO
    // =========================
    @GetMapping("/pago-fallido")
    public String pagoFallido(
            @RequestParam Map<String,String> params
    ){

        System.out.println("========== PAGO FALLIDO ==========");
        params.forEach((k,v) ->
                System.out.println(k + " = " + v)
        );
        System.out.println("==================================");

        return "Pago fallido";
    }
    // =========================
    // PAGO PENDIENTE
    // =========================
    @GetMapping("/pago-pendiente")
    public String pagoPendiente(
            @RequestParam("external_reference") String pedidoId
    ) {

        Pedido pedido =
                pedidoRepository
                        .findById(Long.parseLong(pedidoId))
                        .orElseThrow();

        pedido.setEstado("PENDIENTE");

        pedidoRepository.save(pedido);

        return "Pago pendiente";
    }

}
