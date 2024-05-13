package com.helloshoes.shoeshopmanagement.controller;

import com.helloshoes.shoeshopmanagement.dto.SizeDTO;
import com.helloshoes.shoeshopmanagement.service.SizeService;
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
@RequestMapping("/api/v1/size")
@RequiredArgsConstructor
@Validated
@CrossOrigin
public class SizeController {
    private final SizeService sizeService;

    @GetMapping("/health")
    public String healthTest() {
        return "Category health tested";
    }

    @GetMapping
    public ResponseEntity<List<SizeDTO>> getAllSizes() {
        List<SizeDTO> sizeDTOS = sizeService.getAll();
        return ResponseEntity.ok().body(sizeDTOS);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSizeByCode(@PathVariable String id) {
        if (!id.matches(RegexUtil.SIZE_REGEX)) {
            return ResponseEntity.badRequest().body("Invalid Size code format");
        }
        SizeDTO sizeDTO = sizeService.getByCode(id);
        if (sizeDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(sizeDTO);
    }

    @PostMapping
    public ResponseEntity<?> createSize(@RequestBody @Valid SizeDTO sizeDTO) {
        SizeDTO savedSize = sizeService.save(sizeDTO);
        if (savedSize == null) {
            return ResponseEntity.badRequest().body("Failed to create Size");
        }
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedSize.getSizeCode())
                .toUri();
        return ResponseEntity.created(location).body(savedSize);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSize(@PathVariable String id, @RequestBody @Valid SizeDTO sizeDTO) {
        if (!id.matches(RegexUtil.SIZE_REGEX)) {
            return ResponseEntity.badRequest().body("Invalid Size code format");
        }
        boolean isUpdated = sizeService.update(id, sizeDTO);
        if (!isUpdated) {
            return ResponseEntity.badRequest().body("Failed to update Size");
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSize(@PathVariable String id) {
        if (!id.matches(RegexUtil.SIZE_REGEX)) {
            return ResponseEntity.badRequest().body("Invalid Size code format");
        }
        boolean isDeleted = sizeService.delete(id);
        if (!isDeleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }
}
