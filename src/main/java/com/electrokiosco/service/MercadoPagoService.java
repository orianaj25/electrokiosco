package com.electrokiosco.service;

import com.electrokiosco.model.DetallePedido;
import com.electrokiosco.model.Pedido;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.resources.preference.Preference;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class MercadoPagoService {

    public String crearPreferencia(Pedido pedido) throws Exception {

        try {

            System.out.println("========== MP ==========");
            System.out.println("Pedido ID: " + pedido.getId());
            System.out.println("Cantidad detalles = " + pedido.getDetalles().size());

            List<PreferenceItemRequest> items = new ArrayList<>();

            for (DetallePedido detalle : pedido.getDetalles()) {

                PreferenceItemRequest item =
                        PreferenceItemRequest.builder()
                                .title(detalle.getProducto().getNombre())
                                .quantity(detalle.getCantidad())
                                .currencyId("ARS")
                                .unitPrice(
                                        BigDecimal.valueOf(
                                                detalle.getPrecioUnitario()
                                        )
                                )
                                .build();

                items.add(item);
            }

            PreferenceBackUrlsRequest backUrls =
                    PreferenceBackUrlsRequest.builder()
                            .success("http://localhost:8023/mercadopago/pago-exitoso")
                            .failure("http://localhost:8023/mercadopago/pago-fallido")
                            .pending("http://localhost:8023/mercadopago/pago-pendiente")
                            .build();

            PreferenceRequest preferenceRequest =

                    PreferenceRequest.builder()
                            .items(items)
                            .backUrls(backUrls)
                            .externalReference(
                                    pedido.getId().toString()
                            )

                            .build();

            PreferenceClient client = new PreferenceClient();

            System.out.println("SUCCESS URL = http://localhost:8023/mercadopago/pago-exitoso");
            System.out.println("FAILURE URL = http://localhost:8023/mercadopago/pago-fallido");
            System.out.println("PENDING URL = http://localhost:8023/mercadopago/pago-pendiente");
            Preference preference =
                    client.create(preferenceRequest);

            System.out.println("URL MP:");
            System.out.println(preference.getInitPoint());

            return preference.getInitPoint();

        } catch (MPApiException e) {

            System.out.println("========== ERROR MP ==========");

            System.out.println(
                    e.getApiResponse().getContent()
            );

            System.out.println("========== FIN ERROR ==========");

            throw e;
        }
    }
}