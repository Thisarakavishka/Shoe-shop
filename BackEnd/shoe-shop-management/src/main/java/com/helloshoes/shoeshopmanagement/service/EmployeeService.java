package com.helloshoes.shoeshopmanagement.service;

import com.helloshoes.shoeshopmanagement.dto.CustomerDTO;
import com.helloshoes.shoeshopmanagement.dto.EmployeeDTO;

import java.util.List;

public interface EmployeeService extends SuperService<EmployeeDTO> {
    EmployeeDTO getEmployeeByEmail(String email);

    List<EmployeeDTO> getAll(int page, int size);

    int getEmployeeCount();

    String getNextEmployeeCode();

    List<EmployeeDTO> getSearchEmployees(String query);
}
