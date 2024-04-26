package com.helloshoes.shoeshopmanagement.service;

import com.helloshoes.shoeshopmanagement.dto.CustomerDTO;

public interface CustomerService extends SuperService<CustomerDTO> {
    CustomerDTO
    getCustomerByName(String customerName);
}
