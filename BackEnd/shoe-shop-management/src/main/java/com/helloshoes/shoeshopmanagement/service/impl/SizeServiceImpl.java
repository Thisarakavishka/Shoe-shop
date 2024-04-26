package com.helloshoes.shoeshopmanagement.service.impl;

import com.helloshoes.shoeshopmanagement.dto.SizeDTO;
import com.helloshoes.shoeshopmanagement.entity.Size;
import com.helloshoes.shoeshopmanagement.repository.SizeRepository;
import com.helloshoes.shoeshopmanagement.service.SizeService;
import com.helloshoes.shoeshopmanagement.util.DataConvertor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class SizeServiceImpl implements SizeService {
    private final SizeRepository sizeRepository;
    private final DataConvertor dataConvertor;

    @Override
    public SizeDTO save(SizeDTO dto) {
        boolean isExists = sizeRepository.existsById(dto.getSizeCode());
        if (!isExists) {
            SizeDTO sizeDTO = getSizeBySize(dto.getSize());
            if (sizeDTO == null) {
                return dataConvertor.toSizeDTO(sizeRepository.save(dataConvertor.toSize(dto)));
            }
        }
        return null;
    }

    @Override
    public Boolean delete(String code) {
        if (sizeRepository.existsById(code)) {
            sizeRepository.deleteById(code);
            return true;
        }
        return false;
    }

    @Override
    public SizeDTO getByCode(String code) {
        if (!sizeRepository.existsById(code)) {
            return null;
        }
        return dataConvertor.toSizeDTO(sizeRepository.getReferenceById(code));
    }

    @Override
    public List<SizeDTO> getAll() {
        return dataConvertor.toSizeDTOList(sizeRepository.findAll());
    }

    @Override
    public Boolean update(String code, SizeDTO dto) {
        if (dto.getSizeCode().equals(code)) {
            Optional<Size> size = sizeRepository.findById(code);
            if (size.isPresent()) {
                size.get().setSize(dto.getSize());
                return true;
            }
        }
        return false;
    }

    @Override
    public SizeDTO getSizeBySize(int size) {
        Size dbSize = sizeRepository.findBySize(size);
        if (dbSize == null) {
            return null;
        }
        return dataConvertor.toSizeDTO(dbSize);
    }
}
