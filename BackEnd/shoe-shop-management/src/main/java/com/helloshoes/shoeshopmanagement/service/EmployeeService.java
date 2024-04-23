package com.helloshoes.shoeshopmanagement.service;

import com.helloshoes.shoeshopmanagement.dto.EmployeeDTO;

import java.util.List;

public interface EmployeeService {
    EmployeeDTO saveEmployee(EmployeeDTO employeeDTO);

    Boolean deleteEmployee(String employeeCode);

    EmployeeDTO getEmployeeByCode(String employeeCode);

    List<EmployeeDTO> getAllEmployees();

    Boolean updateEmployee(String employeeCode, EmployeeDTO employeeDTO);

}
