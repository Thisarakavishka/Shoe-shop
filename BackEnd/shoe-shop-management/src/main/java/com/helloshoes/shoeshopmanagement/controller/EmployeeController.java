package com.helloshoes.shoeshopmanagement.controller;

import com.helloshoes.shoeshopmanagement.dto.EmployeeDTO;
import com.helloshoes.shoeshopmanagement.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/employee")
@RequiredArgsConstructor
@Validated
public class EmployeeController {
    private final EmployeeService employeeService;

    @GetMapping("/health")
    public String healthTest() {
        return "customer health tested";
    }

    @GetMapping
    public ResponseEntity<List<EmployeeDTO>> getAllEmployees() {
        List<EmployeeDTO> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok().body(employees);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployeeByCode(@PathVariable String id) {
        if (!id.matches("^EMP\\d{3}$")) {
            return ResponseEntity.badRequest().body("Invalid Employee Code format");
        }
        EmployeeDTO employeeDTO = employeeService.getEmployeeByCode(id);
        if (employeeDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(employeeDTO);
    }

    @PostMapping
    public ResponseEntity<?> createEmployee(@RequestBody @Valid EmployeeDTO employeeDTO) {
        EmployeeDTO savedEmployee = employeeService.saveEmployee(employeeDTO);
        if (savedEmployee == null) {
            return ResponseEntity.badRequest().body("Failed to create Employee");
        }
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedEmployee.getEmployeeCode())
                .toUri();
        return ResponseEntity.created(location).body(savedEmployee);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable String id, @RequestBody @Valid EmployeeDTO employeeDTO) {
        if (!id.matches("^EMP\\d{3}$")) {
            return ResponseEntity.badRequest().body("Invalid Employee Code format");
        }
        boolean isUpdated = employeeService.updateEmployee(id, employeeDTO);
        if (!isUpdated) {
            return ResponseEntity.badRequest().body("Failed to update Employee");
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable String id) {
        if (!id.matches("^EMP\\d{3}$")) {
            return ResponseEntity.badRequest().body("Invalid Employee Code format");
        }
        boolean isDeleted = employeeService.deleteEmployee(id);
        if (!isDeleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }
}
