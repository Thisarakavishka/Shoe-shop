package com.helloshoes.shoeshopmanagement.service.impl;

import com.helloshoes.shoeshopmanagement.dto.CategoryDTO;
import com.helloshoes.shoeshopmanagement.entity.Category;
import com.helloshoes.shoeshopmanagement.repository.CategoryRepository;
import com.helloshoes.shoeshopmanagement.service.CategoryService;
import com.helloshoes.shoeshopmanagement.util.DataConvertor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final DataConvertor dataConvertor;

    @Override
    public CategoryDTO save(CategoryDTO dto) {
        boolean isExists = categoryRepository.existsById(dto.getCategoryCode());
        if (!isExists) {
            return dataConvertor.toCategoryDTO(categoryRepository.save(dataConvertor.toCategory(dto)));
        }
        return null;
    }

    @Override
    public Boolean delete(String code) {
        if (categoryRepository.existsById(code)) {
            categoryRepository.deleteById(code);
            return true;
        }
        return false;
    }

    @Override
    public CategoryDTO getByCode(String code) {
        if (!categoryRepository.existsById(code)) {
            return null;
        }
        return dataConvertor.toCategoryDTO(categoryRepository.getReferenceById(code));
    }

    @Override
    public List<CategoryDTO> getAll() {
        return dataConvertor.toCategoryDTOList(categoryRepository.findAll());
    }

    @Override
    public Boolean update(String code, CategoryDTO dto) {
        if (dto.getCategoryCode().equals(code)) {
            Optional<Category> category = categoryRepository.findById(code);
            if (category.isPresent()) {
                category.get().setCategoryName(dto.getCategoryName());
                category.get().setCategoryCode(dto.getCategoryCode());
                category.get().setCategoryCharacter(dto.getCategoryCharacter());
                return true;
            }
        }
        return true;
    }
}
