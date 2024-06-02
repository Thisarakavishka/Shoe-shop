package com.helloshoes.shoeshopmanagement.service;

import com.helloshoes.shoeshopmanagement.dto.EmployeeDTO;
import com.helloshoes.shoeshopmanagement.dto.JwtAuthResponseDTO;
import com.helloshoes.shoeshopmanagement.dto.SignInDTO;

public interface AuthenticationService {
    JwtAuthResponseDTO signUp(EmployeeDTO signIn);
    JwtAuthResponseDTO signIn(SignInDTO signUp) ;
}
