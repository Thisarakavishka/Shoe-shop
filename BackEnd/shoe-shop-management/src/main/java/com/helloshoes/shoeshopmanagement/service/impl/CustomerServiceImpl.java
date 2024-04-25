package com.helloshoes.shoeshopmanagement.service.impl;

import com.helloshoes.shoeshopmanagement.dto.CustomerDTO;
import com.helloshoes.shoeshopmanagement.entity.Customer;
import com.helloshoes.shoeshopmanagement.repository.CustomerRepository;
import com.helloshoes.shoeshopmanagement.service.CustomerService;
import com.helloshoes.shoeshopmanagement.util.DataConvertor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepository customerRepository;
    private final DataConvertor dataConvertor;

    @Override
    public CustomerDTO save(CustomerDTO dto) {
        boolean isExists = customerRepository.existsById(dto.getCustomerCode());
        if (!isExists) {
            return dataConvertor.toCustomerDTO(customerRepository.save(dataConvertor.toCustomer(dto)));
        }
        return null;
    }

    @Override
    public Boolean delete(String code) {
        if (customerRepository.existsById(code)) {
            customerRepository.deleteById(code);
            return true;
        }
        return false;
    }

    @Override
    public CustomerDTO getByCode(String code) {
        if (!customerRepository.existsById(code)) {
            return null;
        }
        return dataConvertor.toCustomerDTO(customerRepository.getReferenceById(code));
    }

    @Override
    public List<CustomerDTO> getAll() {
        return dataConvertor.toCustomerDTOList(customerRepository.findAll());
    }

    @Override
    public Boolean update(String code, CustomerDTO dto) {
        if (dto.getCustomerCode().equals(code)) {
            Optional<Customer> customer = customerRepository.findById(code);
            if (customer.isPresent()) {
                customer.get().setCustomerName(dto.getCustomerName());
                customer.get().setGender(dto.getGender());
                customer.get().setJoinedDate(dto.getJoinedDate());
                customer.get().setCustomerLevel(dto.getCustomerLevel());
                customer.get().setTotalPoints(dto.getTotalPoints());
                customer.get().setDob(dto.getDob());
                customer.get().setAddressNo(dto.getAddressNo());
                customer.get().setAddressLane(dto.getAddressLane());
                customer.get().setAddressCity(dto.getAddressCity());
                customer.get().setAddressState(dto.getAddressState());
                customer.get().setPostalCode(dto.getPostalCode());
                customer.get().setContactNumber(dto.getContactNumber());
                customer.get().setEmail(dto.getEmail());
                customer.get().setRecentPurchaseDateTime(dto.getRecentPurchaseDateTime());
                return true;
            }
        }
        return false;
    }
}
