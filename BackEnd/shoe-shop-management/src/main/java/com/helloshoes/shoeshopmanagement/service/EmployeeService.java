package com.helloshoes.shoeshopmanagement.service;

import com.helloshoes.shoeshopmanagement.dto.EmployeeDTO;

import java.util.List;

public interface EmployeeService extends SuperService<EmployeeDTO> {
    EmployeeDTO getEmployeeByEmail(String email);
}
