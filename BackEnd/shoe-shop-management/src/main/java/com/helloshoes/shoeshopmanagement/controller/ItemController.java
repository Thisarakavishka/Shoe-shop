package com.helloshoes.shoeshopmanagement.controller;

import com.helloshoes.shoeshopmanagement.dto.ItemDTO;
import com.helloshoes.shoeshopmanagement.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/item")
@RequiredArgsConstructor
@CrossOrigin
public class ItemController {
    private final ItemService itemService;

    @GetMapping("/health")
    public String healthTest() {
        return "Item health Tested";
    }

    @PostMapping
    public ResponseEntity<?> createItem(@RequestBody ItemDTO itemDTO) {
        ItemDTO savedItem = itemService.save(itemDTO);
        return ResponseEntity.ok().body(savedItem);
    }
}
