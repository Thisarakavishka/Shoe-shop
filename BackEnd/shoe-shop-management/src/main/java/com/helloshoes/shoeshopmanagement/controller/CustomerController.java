package com.helloshoes.shoeshopmanagement.controller;

import com.helloshoes.shoeshopmanagement.dto.CustomerDTO;
import com.helloshoes.shoeshopmanagement.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/customer")
@RequiredArgsConstructor
@Validated
public class CustomerController {
    private final CustomerService customerService;

    @GetMapping("/health")
    public String healthTest() {
        return "Customer health tested";
    }

    @GetMapping
    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
        List<CustomerDTO> customerDTOS = customerService.getAll();
        return ResponseEntity.ok().body(customerDTOS);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerByCode(@PathVariable String id) {
        if (!id.matches("^CU\\d{3}$")) {
            return ResponseEntity.badRequest().body("Invalid Customer code format");
        }
        CustomerDTO customerDTO = customerService.getByCode(id);
        if (customerDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(customerDTO);
    }

    @PostMapping
    public ResponseEntity<?> createCustomer(@RequestBody @Valid CustomerDTO customerDTO) {
        CustomerDTO savedCustomer = customerService.save(customerDTO);
        if (savedCustomer == null) {
            return ResponseEntity.badRequest().body("Failed to create Customer");
        }
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedCustomer.getCustomerCode())
                .toUri();
        return ResponseEntity.created(location).body(savedCustomer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable String id, @RequestBody @Valid CustomerDTO customerDTO) {
        if (!id.matches("^CU\\d{3}$")) {
            return ResponseEntity.badRequest().body("Invalid Customer code format");
        }
        boolean isUpdated = customerService.update(id, customerDTO);
        if (!isUpdated) {
            return ResponseEntity.badRequest().body("Failed to update Customer");
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable String id) {
        if (!id.matches("^CU\\d{3}$")) {
            return ResponseEntity.badRequest().body("Invalid Customer code format");
        }
        boolean isDeleted = customerService.delete(id);
        if (!isDeleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }
}
