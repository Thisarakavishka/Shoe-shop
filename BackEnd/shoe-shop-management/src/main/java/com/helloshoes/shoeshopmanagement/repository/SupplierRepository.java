package com.helloshoes.shoeshopmanagement.repository;

import com.helloshoes.shoeshopmanagement.entity.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, String> {
    @Query(value = "SELECT s FROM Supplier s WHERE s.supplierName = :supplierName")
    Supplier findBySupplierName(@Param("supplierName") String supplierName);

    Page<Supplier> findAll(Pageable pageable);

    @Query(value = "SELECT MAX(s.supplierCode) FROM Supplier s")
    String findNextSupplierCode();

    @Query("SELECT s FROM Supplier s WHERE " +
            "LOWER(s.supplierName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(s.category) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(s.country) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(s.addressNo) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(s.addressLane) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(s.addressCity) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(s.addressState) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(s.postalCode) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(s.contactMobile) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(s.contactLandline) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(s.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Supplier> searchSuppliers(String query);
}
