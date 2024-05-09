package com.helloshoes.shoeshopmanagement.service;

import com.helloshoes.shoeshopmanagement.dto.SupplierDTO;

import java.util.List;

public interface SupplierService extends SuperService<SupplierDTO> {
    SupplierDTO getSupplierByName(String supplierName);
    List<SupplierDTO> getAll(int page, int size);

    int getSupplierCount();

    String getNextSupplierCode();

    List<SupplierDTO> getSearchSuppliers(String query);
}
