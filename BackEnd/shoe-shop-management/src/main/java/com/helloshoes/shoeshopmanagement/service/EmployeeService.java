package com.helloshoes.shoeshopmanagement.service;

import com.helloshoes.shoeshopmanagement.dto.EmployeeDTO;

public interface EmployeeService extends SuperService<EmployeeDTO> {
    EmployeeDTO getEmployeeByEmail(String email);
}
