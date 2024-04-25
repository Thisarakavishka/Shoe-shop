package com.helloshoes.shoeshopmanagement.controller;

import com.helloshoes.shoeshopmanagement.dto.SupplierDTO;
import com.helloshoes.shoeshopmanagement.service.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/supplier")
@RequiredArgsConstructor
@Validated
public class SupplierController {
    private final SupplierService supplierService;

    @GetMapping("/health")
    public String healthTest() {
        return "Supplier health tested";
    }

    @GetMapping
    public ResponseEntity<List<SupplierDTO>> getAllSuppliers() {
        List<SupplierDTO> supplierDTOS = supplierService.getAllSuppliers();
        return ResponseEntity.ok().body(supplierDTOS);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSupplierByCode(@PathVariable String id) {
        if (!id.matches("^SU\\d{3}$")) {
            return ResponseEntity.badRequest().body("Invalid Supplier code format");
        }
        SupplierDTO supplierDTO = supplierService.getSupplierByCode(id);
        if (supplierDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(supplierDTO);
    }

    @PostMapping
    public ResponseEntity<?> createSupplier(@RequestBody @Valid SupplierDTO supplierDTO) {
        SupplierDTO savedSupplier = supplierService.saveSupplier(supplierDTO);
        if (savedSupplier == null) {
            return ResponseEntity.badRequest().body("Fail to create supplier");
        }
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedSupplier.getSupplierCode())
                .toUri();
        return ResponseEntity.created(location).body(savedSupplier);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSupplier(@PathVariable String id, @RequestBody @Valid SupplierDTO supplierDTO) {
        if (!id.matches("^SU\\d{3}$")) {
            return ResponseEntity.badRequest().body("Invalid Supplier code format");
        }
        boolean isUpdated = supplierService.updateSupplier(id, supplierDTO);
        if (!isUpdated) {
            return ResponseEntity.badRequest().body("Failed to update supplier");
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSupplier(@PathVariable String id) {
        if (!id.matches("^SU\\d{3}$")) {
            return ResponseEntity.badRequest().body("Invalid Employee Code format");
        }
        boolean isDeleted = supplierService.deleteSupplier(id);
        if (!isDeleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }
}
