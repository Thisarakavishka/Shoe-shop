package com.helloshoes.shoeshopmanagement.controller;

import com.helloshoes.shoeshopmanagement.dto.EmployeeDTO;
import com.helloshoes.shoeshopmanagement.entity.enums.Gender;
import com.helloshoes.shoeshopmanagement.entity.enums.Role;
import com.helloshoes.shoeshopmanagement.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
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

    /*
        @GetMapping("/search")
        public ResponseEntity<EmployeeDTO> searchEmployee(@RequestParam("search") String text) {
            // need to initialize employees from employeeService
            System.out.println(text);

            return ResponseEntity.ok().body(new EmployeeDTO());
        }
    */
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDTO> getEmployeeByCode(@PathVariable String id) {
        // need to initialize employees from employeeService
        EmployeeDTO employeeDTO = new EmployeeDTO();

        return ResponseEntity.ok().body(employeeDTO);
    }

    @PostMapping
    public ResponseEntity<EmployeeDTO> createEmployee(@Valid @RequestBody EmployeeDTO employeeDTO) {
        EmployeeDTO savedEmployee = employeeService.saveEmployee(employeeDTO);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedEmployee.getEmployeeCode())
                .toUri();
        return ResponseEntity.created(location).body(savedEmployee);
    }

    /*
        @PostMapping("/{id}/upload")
        public ResponseEntity<?> uploadProfilePicture(@PathVariable String id, @RequestParam("profile-picture") MultipartFile file) {
            // need to initialize employees from employeeService
            boolean isUploaded = false;
            System.out.println(file.getOriginalFilename());

            return ResponseEntity.ok(file.getOriginalFilename());
        }
    */
    @PutMapping("/{id}")
    public ResponseEntity<Boolean> updateEmployee(@PathVariable String id, @Valid @RequestBody EmployeeDTO employeeDTO) {
        boolean isUpdated = employeeService.updateEmployee(id, employeeDTO);
        return ResponseEntity.ok().body(isUpdated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteEmployee(@PathVariable String id) {
        boolean isDeleted = employeeService.deleteEmployee(id);
        return ResponseEntity.ok(isDeleted);
    }
}
