package com.helloshoes.shoeshopmanagement.service.impl;

import com.helloshoes.shoeshopmanagement.dto.SupplierDTO;
import com.helloshoes.shoeshopmanagement.entity.Supplier;
import com.helloshoes.shoeshopmanagement.repository.SupplierRepository;
import com.helloshoes.shoeshopmanagement.service.SupplierService;
import com.helloshoes.shoeshopmanagement.util.DataConvertor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class SupplierServiceImpl implements SupplierService {
    private final SupplierRepository supplierRepository;
    private final DataConvertor dataConvertor;

    @Override
    public SupplierDTO saveSupplier(SupplierDTO supplierDTO) {
        boolean isExists = supplierRepository.existsById(supplierDTO.getSupplierCode());
        if (!isExists) {
            return dataConvertor.toSupplierDTO(supplierRepository.save(dataConvertor.toSupplier(supplierDTO)));
        }
        return null;
    }

    @Override
    public Boolean deleteSupplier(String supplierCode) {
        if (supplierRepository.existsById(supplierCode)) {
            supplierRepository.deleteById(supplierCode);
            return true;
        }
        return false;
    }

    @Override
    public SupplierDTO getSupplierByCode(String supplierCode) {
        if (!supplierRepository.existsById(supplierCode)) {
            return null;
        }
        return dataConvertor.toSupplierDTO(supplierRepository.getReferenceById(supplierCode));
    }

    @Override
    public List<SupplierDTO> getAllSuppliers() {
        return dataConvertor.toSupplierDTOList(supplierRepository.findAll());
    }

    @Override
    public Boolean updateSupplier(String supplierCode, SupplierDTO supplierDTO) {
        if (supplierDTO.getSupplierCode().equals(supplierCode)) {
            Optional<Supplier> supplier = supplierRepository.findById(supplierCode);
            if (supplier.isPresent()) {
                supplier.get().setSupplierName(supplierDTO.getSupplierName());
                supplier.get().setCategory(supplierDTO.getCategory());
                supplier.get().setAddressNo(supplierDTO.getAddressNo());
                supplier.get().setAddressLane(supplierDTO.getAddressLane());
                supplier.get().setAddressCity(supplierDTO.getAddressCity());
                supplier.get().setAddressState(supplierDTO.getAddressState());
                supplier.get().setPostalCode(supplierDTO.getPostalCode());
                supplier.get().setCountry(supplierDTO.getCountry());
                supplier.get().setContactMobile(supplierDTO.getContactMobile());
                supplier.get().setContactLandline(supplierDTO.getContactLandline());
                supplier.get().setEmail(supplierDTO.getEmail());
                return true;
            }
        }
        return false;
    }
}
