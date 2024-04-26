package com.helloshoes.shoeshopmanagement.util;

import com.helloshoes.shoeshopmanagement.dto.*;
import com.helloshoes.shoeshopmanagement.entity.*;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;

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

    //Category Object Mapping
    public CategoryDTO toCategoryDTO(Category category) {
        return modelMapper.map(category, CategoryDTO.class);
    }

    public Category toCategory(CategoryDTO categoryDTO) {
        return modelMapper.map(categoryDTO, Category.class);
    }

    public List<CategoryDTO> toCategoryDTOList(List<Category> categoryList) {
        return modelMapper.map(categoryList, List.class);
    }

    //Type Object Mapping
    public TypeDTO toTypeDTO(Type type) {
        return modelMapper.map(type, TypeDTO.class);
    }

    public Type toType(TypeDTO typeDTO) {
        return modelMapper.map(typeDTO, Type.class);
    }

    public List<TypeDTO> toTypeDTOList(List<Type> typeList) {
        return modelMapper.map(typeList, List.class);
    }

    //Size Object Mapping
    public SizeDTO toSizeDTO(Size size) {
        return modelMapper.map(size, SizeDTO.class);
    }

    public Size toSize(SizeDTO sizeDTO) {
        return modelMapper.map(sizeDTO, Size.class);
    }

    public List<SizeDTO> toSizeDTOList(List<Size> sizeList) {
        return modelMapper.map(sizeList, List.class);
    }
}