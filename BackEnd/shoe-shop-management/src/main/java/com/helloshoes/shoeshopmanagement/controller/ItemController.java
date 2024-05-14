package com.helloshoes.shoeshopmanagement.controller;

import com.helloshoes.shoeshopmanagement.dto.ItemDTO;
import com.helloshoes.shoeshopmanagement.service.ItemService;
import com.helloshoes.shoeshopmanagement.util.RegexUtil;
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
    @GetMapping("/{id}")
    public ResponseEntity<?> getItemByCode(@PathVariable String id) {
        if (!id.matches(RegexUtil.ITEM_REGEX)) {
            return ResponseEntity.badRequest().body("Invalid Item code format");
        }
        ItemDTO itemDTO = itemService.getByCode(id);
        if (itemDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(itemDTO);
    }
}
