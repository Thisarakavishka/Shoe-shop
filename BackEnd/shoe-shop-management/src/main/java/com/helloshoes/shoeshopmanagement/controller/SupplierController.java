package com.helloshoes.shoeshopmanagement.controller;

import com.helloshoes.shoeshopmanagement.dto.SupplierDTO;
import com.helloshoes.shoeshopmanagement.service.SupplierService;
import com.helloshoes.shoeshopmanagement.util.RegexUtil;
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
@CrossOrigin
public class SupplierController {
    private final SupplierService supplierService;

    @GetMapping("/health")
    public String healthTest() {
        return "Supplier health tested";
    }

    @GetMapping("/all")
    public ResponseEntity<List<SupplierDTO>> getAllSuppliers() {
        List<SupplierDTO> supplierDTOS = supplierService.getAll();
        return ResponseEntity.ok().body(supplierDTOS);
    }

    @GetMapping
    public ResponseEntity<List<SupplierDTO>> getAllSuppliers(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        List<SupplierDTO> supplierDTOS = supplierService.getAll(page, size);
        return ResponseEntity.ok().body(supplierDTOS);
    }

    @GetMapping("/search")
    public ResponseEntity<List<SupplierDTO>> getSearchSuppliers(@RequestParam String query) {
        List<SupplierDTO> supplierDTOS = supplierService.getSearchSuppliers(query);
        return ResponseEntity.ok().body(supplierDTOS);
    }

    @GetMapping("/page-size")
    public ResponseEntity<Integer> getPageCount(@RequestParam(defaultValue = "10") int size) {
        int supplierCount = supplierService.getSupplierCount();
        int pageCount = (int) Math.ceil((double) supplierCount / size);
        return ResponseEntity.ok(pageCount);
    }

    @GetMapping("/next-code")
    public ResponseEntity<String> getNextCSupplierCode() {
        String nextCode = supplierService.getNextSupplierCode();
        return ResponseEntity.ok(nextCode);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSupplierByCode(@PathVariable String id) {
        if (!id.matches(RegexUtil.SUPPLIER_REGEX)) {
            return ResponseEntity.badRequest().body("Invalid Supplier code format");
        }
        SupplierDTO supplierDTO = supplierService.getByCode(id);
        if (supplierDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(supplierDTO);
    }

    @PostMapping
    public ResponseEntity<?> createSupplier(@RequestBody @Valid SupplierDTO supplierDTO) {
        SupplierDTO savedSupplier = supplierService.save(supplierDTO);
        if (savedSupplier == null) {
            return ResponseEntity.badRequest().body("Failed to create supplier");
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
        if (!id.matches(RegexUtil.SUPPLIER_REGEX)) {
            return ResponseEntity.badRequest().body("Invalid Supplier code format");
        }
        boolean isUpdated = supplierService.update(id, supplierDTO);
        if (!isUpdated) {
            return ResponseEntity.badRequest().body("Failed to update supplier");
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSupplier(@PathVariable String id) {
        if (!id.matches(RegexUtil.SUPPLIER_REGEX)) {
            return ResponseEntity.badRequest().body("Invalid Employee Code format");
        }
        boolean isDeleted = supplierService.delete(id);
        if (!isDeleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }
}
