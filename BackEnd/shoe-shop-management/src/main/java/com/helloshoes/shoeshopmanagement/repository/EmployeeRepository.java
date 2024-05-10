package com.helloshoes.shoeshopmanagement.repository;

import com.helloshoes.shoeshopmanagement.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {
    @Query(value = "SELECT e FROM Employee e WHERE e.email = :email")
    Employee findByEmail(@Param("email") String email);

    Page<Employee> findAll(Pageable pageable);

    @Query(value = "SELECT MAX(e.employeeCode) FROM Employee e")
    String findNextEmployeeCode();

    @Query("SELECT e FROM Employee e WHERE " +
            "LOWER(e.employeeName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.gender) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.designation) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.role) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.branch) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.addressNo) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.addressLane) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.addressCity) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.addressState) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.postalCode) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.contactNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.emergencyContactPerson) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.emergencyContactNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Employee> searchEmployees(String query);
}
