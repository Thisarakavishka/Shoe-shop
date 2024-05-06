package com.helloshoes.shoeshopmanagement.controller;

import com.helloshoes.shoeshopmanagement.dto.CustomerDTO;
import com.helloshoes.shoeshopmanagement.service.CustomerService;
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
@RequestMapping("/api/v1/customer")
@RequiredArgsConstructor
@Validated
@CrossOrigin
public class CustomerController {
    private final CustomerService customerService;

    @GetMapping("/health")
    public String healthTest() {
        return "Customer health tested";
    }

    @GetMapping("/all")
    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
        List<CustomerDTO> customerDTOS = customerService.getAll();
        return ResponseEntity.ok().body(customerDTOS);
    }

    @GetMapping
    public ResponseEntity<List<CustomerDTO>> getAllCustomers(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        List<CustomerDTO> customerDTOS = customerService.getAll(page, size);
        return ResponseEntity.ok().body(customerDTOS);
    }

    @GetMapping("/search")
    public ResponseEntity<List<CustomerDTO>> getSearchCustomers(@RequestParam String query) {
        List<CustomerDTO> customerDTOS = customerService.getSearchCustomers(query);
        return ResponseEntity.ok().body(customerDTOS);
    }

    @GetMapping("/page-size")
    public ResponseEntity<Integer> getPageCount(@RequestParam(defaultValue = "10") int size) {
        int customerCount = customerService.getCustomerCount();
        int pageCount = (int) Math.ceil((double) customerCount / size);
        return ResponseEntity.ok(pageCount);
    }

    @GetMapping("/next-code")
    public ResponseEntity<String> getNextCustomerCode() {
        String nextCode = customerService.getNextCustomerCode();
        return ResponseEntity.ok(nextCode);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerByCode(@PathVariable String id) {
        if (!id.matches(RegexUtil.CUSTOMER_REGEX)) {
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
        if (!id.matches(RegexUtil.CUSTOMER_REGEX)) {
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
        if (!id.matches(RegexUtil.CUSTOMER_REGEX)) {
            return ResponseEntity.badRequest().body("Invalid Customer code format");
        }
        boolean isDeleted = customerService.delete(id);
        if (!isDeleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }
}
