package com.helloshoes.shoeshopmanagement.service.impl;

import com.helloshoes.shoeshopmanagement.repository.EmployeeRepository;
import com.helloshoes.shoeshopmanagement.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {
    private final EmployeeRepository employeeRepository;

    @Override
    public UserDetailsService userDetailsService() {
        return username -> employeeRepository.findUserByEmail(username)
                .orElseThrow(()-> new UsernameNotFoundException("User Not Found"));
    }
}
