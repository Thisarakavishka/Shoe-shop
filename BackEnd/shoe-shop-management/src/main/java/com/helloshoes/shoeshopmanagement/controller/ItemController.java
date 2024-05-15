package com.helloshoes.shoeshopmanagement.controller;

import com.helloshoes.shoeshopmanagement.dto.ItemDTO;
import com.helloshoes.shoeshopmanagement.service.ItemService;
import com.helloshoes.shoeshopmanagement.util.RegexUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/all")
    public ResponseEntity<List<ItemDTO>> getAllItems() {
        List<ItemDTO> itemDTOS = itemService.getAll();
        return ResponseEntity.ok().body(itemDTOS);
    }

    @GetMapping
    public ResponseEntity<List<ItemDTO>> getAllItems(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        List<ItemDTO> itemDTOS = itemService.getAll(page, size);
        return ResponseEntity.ok().body(itemDTOS);
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
