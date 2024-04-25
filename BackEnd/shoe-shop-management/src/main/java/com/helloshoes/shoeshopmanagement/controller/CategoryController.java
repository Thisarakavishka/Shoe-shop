package com.helloshoes.shoeshopmanagement.controller;

import com.helloshoes.shoeshopmanagement.dto.CategoryDTO;
import com.helloshoes.shoeshopmanagement.service.CategoryService;
import com.helloshoes.shoeshopmanagement.util.RegexUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/category")
@RequiredArgsConstructor
@Validated
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping("/health")
    public String healthTest() {
        return "Category health tested";
    }

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        List<CategoryDTO> categoryDTOS = categoryService.getAll();
        return ResponseEntity.ok().body(categoryDTOS);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryByCode(@PathVariable String id) {
        if (!id.matches(RegexUtil.CATEGORY_REGEX)) {
            return ResponseEntity.badRequest().body("Invalid Category code format");
        }
        CategoryDTO categoryDTO = categoryService.getByCode(id);
        if (categoryDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(categoryDTO);
    }

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody @Valid CategoryDTO categoryDTO) {
        CategoryDTO savedCategory = categoryService.save(categoryDTO);
        if (savedCategory == null) {
            return ResponseEntity.badRequest().body("Failed to create Category");
        }
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedCategory.getCategoryCode())
                .toUri();
        return ResponseEntity.created(location).body(savedCategory);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable String id, @RequestBody @Valid CategoryDTO categoryDTO) {
        if (!id.matches(RegexUtil.CATEGORY_REGEX)) {
            return ResponseEntity.badRequest().body("Invalid Category code format");
        }
        boolean isUpdated = categoryService.update(id, categoryDTO);
        if (!isUpdated) {
            return ResponseEntity.badRequest().body("Failed to update Category");
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable String id) {
        if (!id.matches(RegexUtil.CATEGORY_REGEX)) {
            return ResponseEntity.badRequest().body("Invalid Category code format");
        }
        boolean isDeleted = categoryService.delete(id);
        if (!isDeleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }
}
