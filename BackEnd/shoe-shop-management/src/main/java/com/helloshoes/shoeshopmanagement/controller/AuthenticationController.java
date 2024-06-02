package com.helloshoes.shoeshopmanagement.controller;

import com.helloshoes.shoeshopmanagement.dto.EmployeeDTO;
import com.helloshoes.shoeshopmanagement.dto.SignInDTO;
import com.helloshoes.shoeshopmanagement.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @GetMapping("/health")
    public String healthCheck() {
        return "Authentication Health Good";
    }

    // SignIn
    @PutMapping
    public ResponseEntity signIn(@Valid @RequestBody SignInDTO signIn) {
        return ResponseEntity.accepted().body(authenticationService.signIn(signIn));
    }

    // SignUp
    @PostMapping
    public ResponseEntity signUp(@RequestBody @Valid EmployeeDTO employeeDTO) {
        return ResponseEntity.accepted().body(authenticationService.signUp(employeeDTO));
    }
}
