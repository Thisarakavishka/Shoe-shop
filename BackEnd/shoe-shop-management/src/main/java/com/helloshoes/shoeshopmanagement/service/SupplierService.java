package com.helloshoes.shoeshopmanagement.service;

import com.helloshoes.shoeshopmanagement.dto.SupplierDTO;

import java.util.List;

public interface SupplierService {
    SupplierDTO saveSupplier(SupplierDTO supplierDTO);

    Boolean deleteSupplier(String supplierCode);

    SupplierDTO getSupplierByCode(String supplierCode);

    List<SupplierDTO> getAllSuppliers();

    Boolean updateSupplier(String supplierCode, SupplierDTO supplierDTO);
}
