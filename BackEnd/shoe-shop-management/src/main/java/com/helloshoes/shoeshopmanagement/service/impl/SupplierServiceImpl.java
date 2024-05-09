package com.helloshoes.shoeshopmanagement.service.impl;

import com.helloshoes.shoeshopmanagement.dto.SupplierDTO;
import com.helloshoes.shoeshopmanagement.entity.Supplier;
import com.helloshoes.shoeshopmanagement.repository.SupplierRepository;
import com.helloshoes.shoeshopmanagement.service.SupplierService;
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
public class SupplierServiceImpl implements SupplierService {
    private final SupplierRepository supplierRepository;
    private final DataConvertor dataConvertor;

    @Override
    public SupplierDTO save(SupplierDTO supplierDTO) {
        boolean isExists = supplierRepository.existsById(supplierDTO.getSupplierCode());
        if (!isExists) {
            SupplierDTO dbSupplier = getSupplierByName(supplierDTO.getSupplierName());
            if (dbSupplier == null) {
                return dataConvertor.toSupplierDTO(supplierRepository.save(dataConvertor.toSupplier(supplierDTO)));
            }
        }
        return null;
    }

    @Override
    public Boolean delete(String supplierCode) {
        if (supplierRepository.existsById(supplierCode)) {
            supplierRepository.deleteById(supplierCode);
            return true;
        }
        return false;
    }

    @Override
    public SupplierDTO getByCode(String supplierCode) {
        if (!supplierRepository.existsById(supplierCode)) {
            return null;
        }
        return dataConvertor.toSupplierDTO(supplierRepository.getReferenceById(supplierCode));
    }

    @Override
    public List<SupplierDTO> getAll() {
        return dataConvertor.toSupplierDTOList(supplierRepository.findAll());
    }

    @Override
    public Boolean update(String supplierCode, SupplierDTO supplierDTO) {
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

    @Override
    public SupplierDTO getSupplierByName(String supplierName) {
        Supplier supplier = supplierRepository.findBySupplierName(supplierName);
        if (supplier == null) {
            return null;
        }
        return dataConvertor.toSupplierDTO(supplier);
    }

    @Override
    public List<SupplierDTO> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Supplier> suppliers = supplierRepository.findAll(pageable);
        return dataConvertor.toSupplierDTOList(suppliers.getContent());
    }

    @Override
    public int getSupplierCount() {
        return (int) supplierRepository.count();
    }

    @Override
    public String getNextSupplierCode() {
        String nextCode = supplierRepository.findNextSupplierCode();
        if (nextCode == null) {
            return "SUP001";
        }
        int code = Integer.parseInt(nextCode.substring(3)) + 1;
        return "SUP" + String.format("%03d", code);
    }

    @Override
    public List<SupplierDTO> getSearchSuppliers(String query) {
        List<Supplier> suppliers = supplierRepository.searchSuppliers(query);
        return dataConvertor.toSupplierDTOList(suppliers);
    }
}
