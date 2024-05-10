package com.helloshoes.shoeshopmanagement.controller;

import com.helloshoes.shoeshopmanagement.dto.EmployeeDTO;
import com.helloshoes.shoeshopmanagement.service.EmployeeService;
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
@RequestMapping("/api/v1/employee")
@RequiredArgsConstructor
@Validated
@CrossOrigin
public class EmployeeController {
    private final EmployeeService employeeService;

    @GetMapping("/health")
    public String healthTest() {
        return "customer health tested";
    }

    @GetMapping("/all")
    public ResponseEntity<List<EmployeeDTO>> getAllEmployees() {
        List<EmployeeDTO> employees = employeeService.getAll();
        return ResponseEntity.ok().body(employees);
    }

    @GetMapping
    public ResponseEntity<List<EmployeeDTO>> getAllEmployees(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        List<EmployeeDTO> employeeDTOS = employeeService.getAll(page, size);
        return ResponseEntity.ok().body(employeeDTOS);
    }

    @GetMapping("/search")
    public ResponseEntity<List<EmployeeDTO>> getSearchEmployees(@RequestParam String query) {
        List<EmployeeDTO> employeeDTOS = employeeService.getSearchEmployees(query);
        return ResponseEntity.ok().body(employeeDTOS);
    }

    @GetMapping("/page-size")
    public ResponseEntity<Integer> getPageCount(@RequestParam(defaultValue = "10") int size) {
        int employeeCount = employeeService.getEmployeeCount();
        int pageCount = (int) Math.ceil((double) employeeCount / size);
        return ResponseEntity.ok(pageCount);
    }

    @GetMapping("/next-code")
    public ResponseEntity<String> getNextEmployeeCode() {
        String nextCode = employeeService.getNextEmployeeCode();
        return ResponseEntity.ok(nextCode);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployeeByCode(@PathVariable String id) {
        if (!id.matches(RegexUtil.EMPLOYEE_REGEX)) {
            return ResponseEntity.badRequest().body("Invalid Employee Code format");
        }
        EmployeeDTO employeeDTO = employeeService.getByCode(id);
        if (employeeDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(employeeDTO);
    }

    @PostMapping
    public ResponseEntity<?> createEmployee(@RequestBody @Valid EmployeeDTO employeeDTO) {
        EmployeeDTO savedEmployee = employeeService.save(employeeDTO);
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
        if (!id.matches(RegexUtil.EMPLOYEE_REGEX)) {
            return ResponseEntity.badRequest().body("Invalid Employee Code format");
        }
        boolean isUpdated = employeeService.update(id, employeeDTO);
        if (!isUpdated) {
            return ResponseEntity.badRequest().body("Failed to update Employee");
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable String id) {
        if (!id.matches(RegexUtil.EMPLOYEE_REGEX)) {
            return ResponseEntity.badRequest().body("Invalid Employee Code format");
        }
        boolean isDeleted = employeeService.delete(id);
        if (!isDeleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }
}
