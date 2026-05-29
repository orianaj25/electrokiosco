package com.electrokiosco.controller;

import com.electrokiosco.model.Producto;
import com.electrokiosco.service.ProductoService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/productos")
@CrossOrigin
public class ProductoController {

    private final ProductoService service;

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
            String carpeta = "uploads/";
            String nombreArchivo = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            Path ruta = Paths.get(carpeta + nombreArchivo);

            Files.createDirectories(ruta.getParent());
            Files.write(ruta, file.getBytes());

            return "/uploads/" + nombreArchivo;

        } catch (IOException e) {
            throw new RuntimeException("Error al subir imagen");
        }
    }

    @PutMapping("/{id}")
    public Producto actualizar(@PathVariable Long id, @RequestBody Producto producto) {

        Producto existente = service.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        existente.setNombre(producto.getNombre());
        existente.setDescripcion(producto.getDescripcion());
        existente.setPrecio(producto.getPrecio());
        existente.setImagen(producto.getImagen());

        return service.guardar(existente);
    }
}