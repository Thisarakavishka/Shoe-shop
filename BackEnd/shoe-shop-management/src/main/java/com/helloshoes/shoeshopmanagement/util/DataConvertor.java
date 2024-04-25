package com.helloshoes.shoeshopmanagement.util;

import com.helloshoes.shoeshopmanagement.dto.CustomerDTO;
import com.helloshoes.shoeshopmanagement.dto.EmployeeDTO;
import com.helloshoes.shoeshopmanagement.dto.SupplierDTO;
import com.helloshoes.shoeshopmanagement.entity.Customer;
import com.helloshoes.shoeshopmanagement.entity.Employee;
import com.helloshoes.shoeshopmanagement.entity.Supplier;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DataConvertor {
    private final ModelMapper modelMapper;

    //Employee Object Mapping
    public EmployeeDTO toEmployeeDTO(Employee employee) {
        return modelMapper.map(employee, EmployeeDTO.class);
    }

    public Employee toEmployee(EmployeeDTO employeeDTO) {
        return modelMapper.map(employeeDTO, Employee.class);
    }

    public List<EmployeeDTO> toEmployeeDTOList(List<Employee> employeeList) {
        return modelMapper.map(employeeList, List.class);
    }

    //Supplier Object Mapping
    public SupplierDTO toSupplierDTO(Supplier supplier) {
        return modelMapper.map(supplier, SupplierDTO.class);
    }

    public Supplier toSupplier(SupplierDTO supplierDTO) {
        return modelMapper.map(supplierDTO, Supplier.class);
    }

    public List<SupplierDTO> toSupplierDTOList(List<Supplier> supplierList) {
        return modelMapper.map(supplierList, List.class);
    }

    //Customer Object Mapping
    public CustomerDTO toCustomerDTO(Customer customer) {
        return modelMapper.map(customer, CustomerDTO.class);
    }

    public Customer toCustomer(CustomerDTO customerDTO) {
        return modelMapper.map(customerDTO, Customer.class);
    }

    public List<CustomerDTO> toCustomerDTOList(List<Customer> customerList) {
        return modelMapper.map(customerList, List.class);
    }
}
