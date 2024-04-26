package com.helloshoes.shoeshopmanagement.service.impl;

import com.helloshoes.shoeshopmanagement.dto.TypeDTO;
import com.helloshoes.shoeshopmanagement.entity.Type;
import com.helloshoes.shoeshopmanagement.repository.TypeRepository;
import com.helloshoes.shoeshopmanagement.service.TypeService;
import com.helloshoes.shoeshopmanagement.util.DataConvertor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class TypeServiceImpl implements TypeService {
    private final TypeRepository typeRepository;
    private final DataConvertor dataConvertor;

    @Override
    public TypeDTO save(TypeDTO dto) {
        boolean isExists = typeRepository.existsById(dto.getTypeCode());
        if (!isExists) {
            TypeDTO dbType = getTypeByName(dto.getTypeName());
            if (dbType == null) {
                return dataConvertor.toTypeDTO(typeRepository.save(dataConvertor.toType(dto)));

            }
        }
        return null;
    }

    @Override
    public Boolean delete(String code) {
        if (typeRepository.existsById(code)) {
            typeRepository.deleteById(code);
            return true;
        }
        return false;
    }

    @Override
    public TypeDTO getByCode(String code) {
        if (!typeRepository.existsById(code)) {
            return null;
        }
        return dataConvertor.toTypeDTO(typeRepository.getReferenceById(code));

    }

    @Override
    public List<TypeDTO> getAll() {
        return dataConvertor.toTypeDTOList(typeRepository.findAll());
    }

    @Override
    public Boolean update(String code, TypeDTO dto) {
        if (dto.getTypeCode().equals(code)) {
            Optional<Type> type = typeRepository.findById(code);
            if (type.isPresent()) {
                type.get().setTypeName(dto.getTypeName());
                type.get().setTypeCharacter(dto.getTypeCharacter());
                return true;
            }
        }
        return false;
    }

    @Override
    public TypeDTO getTypeByName(String typeName) {
        Type type = typeRepository.findByTypeName(typeName);
        if (type == null) {
            return null;
        }
        return dataConvertor.toTypeDTO(type);
    }
}
