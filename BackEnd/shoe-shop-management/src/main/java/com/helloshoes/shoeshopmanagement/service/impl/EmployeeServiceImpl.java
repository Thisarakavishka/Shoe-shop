package com.helloshoes.shoeshopmanagement.service.impl;

import com.helloshoes.shoeshopmanagement.dto.EmployeeDTO;
import com.helloshoes.shoeshopmanagement.entity.Employee;
import com.helloshoes.shoeshopmanagement.repository.EmployeeRepository;
import com.helloshoes.shoeshopmanagement.service.EmployeeService;
import com.helloshoes.shoeshopmanagement.util.DataConvertor;
import lombok.RequiredArgsConstructor;
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
    public EmployeeDTO saveEmployee(EmployeeDTO employeeDTO) {
        return dataConvertor.toEmployeeDTO(employeeRepository.save(dataConvertor.toEmployee(employeeDTO)));
    }

    @Override
    public Boolean deleteEmployee(String employeeCode) {
        if (employeeRepository.existsById(employeeCode)) {
            System.out.println("found employee");
            employeeRepository.deleteById(employeeCode);
            return true;
        }
        System.out.println("not found employee");
        return false;
    }

    @Override
    public EmployeeDTO getEmployeeByCode(String employeeCode) {
        if (!employeeRepository.existsById(employeeCode)) {
            return dataConvertor.toEmployeeDTO(employeeRepository.getReferenceById(employeeCode));
        }
        return null;
    }

    @Override
    public List<EmployeeDTO> getAllEmployees() {
        return dataConvertor.toEmployeeDTOList(employeeRepository.findAll());
    }

    @Override
    public Boolean updateEmployee(String employeeCode, EmployeeDTO employeeDTO) {
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
        return false;
    }
}
