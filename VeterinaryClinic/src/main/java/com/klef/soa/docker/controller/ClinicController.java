package com.klef.soa.docker.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klef.soa.docker.dto.ClinicRequest;
import com.klef.soa.docker.entity.Clinic;
import com.klef.soa.docker.service.ClinicService;

@RestController
@RequestMapping("/clinic")
@CrossOrigin("*")
public class ClinicController {
	@Autowired
private	ClinicService service;
@PostMapping("/add")
	public ResponseEntity<Clinic> add(@RequestBody ClinicRequest request) {
		return ResponseEntity.ok(service.add(request));
	}
@GetMapping("/displayall")
public ResponseEntity<List<Clinic>> displayall() {
	return ResponseEntity.ok(service.displayall());
}
@GetMapping("/displaybyid/{id}")
public ResponseEntity<Optional<Clinic>> displaybyid(@PathVariable Long id) {
	return ResponseEntity.ok(service.getbyid(id));
}
@PutMapping("/update/{id}")
public ResponseEntity<Clinic> update(@RequestBody ClinicRequest request, @PathVariable long id) {
	return ResponseEntity.ok(service.update(request, id));
}
@DeleteMapping("/delete/{id}")
public ResponseEntity<String> delete(@PathVariable long id) {
	return ResponseEntity.ok(service.delete(id));
}

}
