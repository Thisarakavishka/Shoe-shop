package com.helloshoes.shoeshopmanagement.controller;

import com.helloshoes.shoeshopmanagement.dto.RefundDTO;
import com.helloshoes.shoeshopmanagement.dto.SaleDTO;
import com.helloshoes.shoeshopmanagement.service.SalesService;
import com.helloshoes.shoeshopmanagement.util.RegexUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/v1/sales")
@RequiredArgsConstructor
@CrossOrigin
public class SalesController {
    private final SalesService salesService;

    @PostMapping
    public ResponseEntity<?> createSale(@RequestBody SaleDTO saleDTO) {
        SaleDTO saveSaleDTO = salesService.save(saleDTO);
        if (saveSaleDTO == null) {
            return ResponseEntity.badRequest().body("Failed to create Sale");
        }
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(saveSaleDTO.getSaleCode())
                .toUri();
        return ResponseEntity.created(location).body(saveSaleDTO);
    }

    @GetMapping
    public ResponseEntity<List<SaleDTO>> getAllSales() {
        List<SaleDTO> sales = salesService.getAll();
        return ResponseEntity.ok().body(sales);
    }

    @GetMapping("/{code}")
    public ResponseEntity<?> getSaleByCode(@PathVariable String code) {
        if (!code.matches(RegexUtil.SALE_REGEX)) {
            return ResponseEntity.badRequest().body("Invalid Sale Code format");
        }
        SaleDTO saleDTO = salesService.getByCode(code);
        if (saleDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(saleDTO);
    }

    @GetMapping("/next-code")
    public ResponseEntity<String> getNextSaleCode() {
        String nextCode = salesService.getNextSaleCode();
        return ResponseEntity.ok(nextCode);
    }

    @GetMapping("/within-days")
    public ResponseEntity<List<SaleDTO>> getSalesWithinDays(@RequestParam(defaultValue = "3") int days) {
        Calendar calendar = Calendar.getInstance();
        Date endDate = calendar.getTime();
        calendar.add(Calendar.DAY_OF_YEAR, -days);
        Date startDate = calendar.getTime();

        List<SaleDTO> sales = salesService.getSalesWithinDateRange(startDate, endDate);
        return ResponseEntity.ok().body(sales);
    }

    @PutMapping("/{code}")
    public ResponseEntity<?> updateSale(@PathVariable String code, @RequestBody RefundDTO refundDTO) {
        System.out.println("hit on refund/update method sale controller");
        System.out.println(refundDTO);
        boolean isUpdated = salesService.update(code, refundDTO);
        if (!isUpdated) {
            return ResponseEntity.badRequest().body("Failed to Refund");
        }
        return ResponseEntity.ok().build();
    }
}
