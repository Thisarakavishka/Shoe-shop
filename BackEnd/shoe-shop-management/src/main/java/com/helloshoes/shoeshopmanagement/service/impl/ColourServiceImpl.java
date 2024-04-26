package com.helloshoes.shoeshopmanagement.service.impl;

import com.helloshoes.shoeshopmanagement.dto.ColourDTO;
import com.helloshoes.shoeshopmanagement.entity.Colour;
import com.helloshoes.shoeshopmanagement.repository.ColourRepository;
import com.helloshoes.shoeshopmanagement.service.ColourService;
import com.helloshoes.shoeshopmanagement.util.DataConvertor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class ColourServiceImpl implements ColourService {
    private final ColourRepository colourRepository;
    private final DataConvertor dataConvertor;

    @Override
    public ColourDTO getColourByName(String colourName) {
        Colour colour = colourRepository.findByName(colourName);
        if (colour == null) {
            return null;
        }
        return dataConvertor.toColourDTO(colour);
    }

    @Override
    public ColourDTO save(ColourDTO dto) {
        boolean isExists = colourRepository.existsById(dto.getColourCode());
        if (!isExists) {
            ColourDTO colourDTO = getColourByName(dto.getColourName());
            if (colourDTO == null) {
                return dataConvertor.toColourDTO(colourRepository.save(dataConvertor.toColour(dto)));
            }
        }
        return null;
    }

    @Override
    public Boolean delete(String code) {
        if (colourRepository.existsById(code)) {
            colourRepository.deleteById(code);
            return true;
        }
        return false;
    }

    @Override
    public ColourDTO getByCode(String code) {
        if (!colourRepository.existsById(code)) {
            return null;
        }
        return dataConvertor.toColourDTO(colourRepository.getReferenceById(code));

    }

    @Override
    public List<ColourDTO> getAll() {
        return dataConvertor.toColourDTOList(colourRepository.findAll());
    }

    @Override
    public Boolean update(String code, ColourDTO dto) {
        if (dto.getColourCode().equals(code)) {
            Optional<Colour> colour = colourRepository.findById(code);
            if (colour.isPresent()) {
                colour.get().setColourName(dto.getColourName());
                colour.get().setHexValue(dto.getHexValue());
                return true;
            }
        }
        return false;
    }
}
