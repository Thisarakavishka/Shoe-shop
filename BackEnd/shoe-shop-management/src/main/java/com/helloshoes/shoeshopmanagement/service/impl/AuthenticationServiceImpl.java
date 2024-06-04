package com.helloshoes.shoeshopmanagement.service.impl;

import com.helloshoes.shoeshopmanagement.dto.EmployeeDTO;
import com.helloshoes.shoeshopmanagement.dto.JwtAuthResponseDTO;
import com.helloshoes.shoeshopmanagement.dto.SignInDTO;
import com.helloshoes.shoeshopmanagement.entity.Employee;
import com.helloshoes.shoeshopmanagement.repository.EmployeeRepository;
import com.helloshoes.shoeshopmanagement.service.AuthenticationService;
import com.helloshoes.shoeshopmanagement.service.JWTService;
import com.helloshoes.shoeshopmanagement.util.DataConvertor;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final JWTService jwtService;
    private final EmployeeRepository employeeRepository;

    //    Utils
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;


    @Override
    public JwtAuthResponseDTO signIn(SignInDTO signIn) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(signIn.getEmail(), signIn.getPassword())
        );

        Employee byEmail = employeeRepository.findUserByEmail(signIn.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found"));


        String token = jwtService.generateToken(byEmail);

        return new JwtAuthResponseDTO(token, new DataConvertor(new ModelMapper()).toEmployeeDTO(byEmail));
    }

    @Override
    public JwtAuthResponseDTO signUp(EmployeeDTO signUp) {
        if (employeeRepository.findUserByEmail(signUp.getEmail()).isPresent()) {
            return null;
        }

        Employee employee = new ModelMapper().map(signUp, Employee.class);
        employee.setEmployeeCode(UUID.randomUUID().toString());
        employee.setPassword(passwordEncoder.encode(signUp.getPassword()));

        Employee save = employeeRepository.save(employee);
        String token = jwtService.generateToken(save);

        return new JwtAuthResponseDTO(token, new ModelMapper().map(save, EmployeeDTO.class));
    }
}
