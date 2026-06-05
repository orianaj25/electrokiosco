package com.electrokiosco.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.electrokiosco.model.Producto;
import com.electrokiosco.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/productos")
@CrossOrigin
public class ProductoController {

    private final ProductoService service;

    @Autowired
    private Cloudinary cloudinary;

    public ProductoController(ProductoService service) {
        this.service = service;
    }

    // 🔹 LISTAR
    @GetMapping
    public List<Producto> listar() {
        return service.listar();
    }

    // 🔹 GUARDAR
    @PostMapping
    public Producto guardar(@RequestBody Producto producto) {
        return service.guardar(producto);
    }

    // 🔹 ELIMINAR
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }

    // 🔹 PRODUCTOS POR CATEGORIA
    @GetMapping("/categoria/{id}")
    public List<Producto> porCategoria(@PathVariable Long id) {
        return service.porCategoria(id);
    }

    // 🔥 SUBIR IMAGEN
    @PostMapping("/upload")
    public String subirImagen(@RequestParam("file") MultipartFile file) {

        try {

            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.emptyMap()
            );

            return uploadResult.get("secure_url").toString();

        } catch (IOException e) {
            throw new RuntimeException("Error al subir imagen", e);
        }
        }

    @PutMapping("/{id}")
    public Producto actualizar(@PathVariable Long id, @RequestBody Producto producto) {

        Producto existente = service.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        existente.setNombre(producto.getNombre());
        existente.setDescripcion(producto.getDescripcion());
        existente.setPrecio(producto.getPrecio());
        if(producto.getImagen() != null &&
                !producto.getImagen().isBlank()){

            existente.setImagen(producto.getImagen());

        }
        return service.guardar(existente);
    }
}