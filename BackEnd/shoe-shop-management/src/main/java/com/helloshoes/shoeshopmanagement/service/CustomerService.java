package com.helloshoes.shoeshopmanagement.service;

import com.helloshoes.shoeshopmanagement.dto.CustomerDTO;

import java.util.List;

public interface CustomerService extends SuperService<CustomerDTO> {
    CustomerDTO getCustomerByName(String customerName);

    List<CustomerDTO> getAll(int page, int size);

    int getCustomerCount();

    String getNextCustomerCode();

    List<CustomerDTO> getSearchCustomers(String query);
}
