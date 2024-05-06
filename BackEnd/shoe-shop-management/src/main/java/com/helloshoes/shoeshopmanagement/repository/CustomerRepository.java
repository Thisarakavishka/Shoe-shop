package com.helloshoes.shoeshopmanagement.repository;

import com.helloshoes.shoeshopmanagement.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {
    @Query(value = "SELECT c FROM Customer c WHERE c.customerName = :customerName")
    Customer findByName(@Param("customerName") String customerName);

    Page<Customer> findAll(Pageable pageable);

    @Query(value = "SELECT MAX(c.customerCode) FROM Customer c")
    String findNextCustomerCode();

    @Query("SELECT c FROM Customer c WHERE " +
            "LOWER(c.customerName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.gender) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.customerLevel) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.addressNo) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.addressLane) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.addressCity) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.addressState) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.postalCode) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.contactNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Customer> searchCustomers(String query);
}
