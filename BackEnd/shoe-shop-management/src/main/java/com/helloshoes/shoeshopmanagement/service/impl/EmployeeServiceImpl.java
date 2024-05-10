package com.helloshoes.shoeshopmanagement.service.impl;

import com.helloshoes.shoeshopmanagement.dto.EmployeeDTO;
import com.helloshoes.shoeshopmanagement.entity.Employee;
import com.helloshoes.shoeshopmanagement.repository.EmployeeRepository;
import com.helloshoes.shoeshopmanagement.service.EmployeeService;
import com.helloshoes.shoeshopmanagement.util.DataConvertor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final DataConvertor dataConvertor;

    @Override
    public EmployeeDTO save(EmployeeDTO employeeDTO) {
        boolean isExists = employeeRepository.existsById(employeeDTO.getEmployeeCode());
        if (!isExists) {
            EmployeeDTO dbEmployee = getEmployeeByEmail(employeeDTO.getEmail());
            if (dbEmployee == null) {
                return dataConvertor.toEmployeeDTO(employeeRepository.save(dataConvertor.toEmployee(employeeDTO)));
            }
        }
        return null;
    }

    @Override
    public Boolean delete(String employeeCode) {
        if (employeeRepository.existsById(employeeCode)) {
            employeeRepository.deleteById(employeeCode);
            return true;
        }
        return false;
    }

    @Override
    public EmployeeDTO getByCode(String employeeCode) {
        if (!employeeRepository.existsById(employeeCode)) {
            return null;
        }
        return dataConvertor.toEmployeeDTO(employeeRepository.getReferenceById(employeeCode));
    }

    @Override
    public List<EmployeeDTO> getAll() {
        return dataConvertor.toEmployeeDTOList(employeeRepository.findAll());
    }

    @Override
    public Boolean update(String employeeCode, EmployeeDTO employeeDTO) {
        if (employeeDTO.getEmployeeCode().equals(employeeCode)) {
            Optional<Employee> existingEmployee = employeeRepository.findById(employeeCode);
            if (existingEmployee.isPresent()) {
                existingEmployee.get().setEmployeeName(employeeDTO.getEmployeeName());
                existingEmployee.get().setProfilePic(employeeDTO.getProfilePic());
                existingEmployee.get().setGender(employeeDTO.getGender());
                existingEmployee.get().setStatus(employeeDTO.getStatus());
                existingEmployee.get().setDesignation(employeeDTO.getDesignation());
                existingEmployee.get().setRole(employeeDTO.getRole());
                existingEmployee.get().setDob(employeeDTO.getDob());
                existingEmployee.get().setJoinedDate(employeeDTO.getJoinedDate());
                existingEmployee.get().setBranch(employeeDTO.getBranch());
                existingEmployee.get().setAddressNo(employeeDTO.getAddressNo());
                existingEmployee.get().setAddressLane(employeeDTO.getAddressLane());
                existingEmployee.get().setAddressCity(employeeDTO.getAddressCity());
                existingEmployee.get().setAddressState(employeeDTO.getAddressState());
                existingEmployee.get().setPostalCode(employeeDTO.getPostalCode());
                existingEmployee.get().setContactNumber(employeeDTO.getContactNumber());
                existingEmployee.get().setEmail(employeeDTO.getEmail());
                existingEmployee.get().setPassword(employeeDTO.getPassword());
                existingEmployee.get().setEmergencyContactPerson(employeeDTO.getEmergencyContactPerson());
                existingEmployee.get().setEmergencyContactNumber(employeeDTO.getEmergencyContactNumber());
                return true;
            }
        }
        return false;
    }

    @Override
    public EmployeeDTO getEmployeeByEmail(String email) {
        Employee employee = employeeRepository.findByEmail(email);
        if (employee == null) {
            return null;
        }
        return dataConvertor.toEmployeeDTO(employee);
    }

    @Override
    public List<EmployeeDTO> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Employee> employees = employeeRepository.findAll(pageable);
        return dataConvertor.toEmployeeDTOList(employees.getContent());
    }

    @Override
    public int getEmployeeCount() {
        return (int) employeeRepository.count();
    }

    @Override
    public String getNextEmployeeCode() {
        String nextCode = employeeRepository.findNextEmployeeCode();
        if (nextCode == null) {
            return "EMP001";
        }
        int code = Integer.parseInt(nextCode.substring(3)) + 1;
        return "EMP" + String.format("%03d", code);
    }

    @Override
    public List<EmployeeDTO> getSearchEmployees(String query) {
        List<Employee> employees = employeeRepository.searchEmployees(query);
        return dataConvertor.toEmployeeDTOList(employees);
    }
}
