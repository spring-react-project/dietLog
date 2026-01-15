package jpabook.jpabasic.api;

import jpabook.jpabasic.api.dto.FoodSearchResponse;
import jpabook.jpabasic.service.FoodSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/foods/search")
public class FoodSearchController {

    private final FoodSearchService foodSearchService;

    @GetMapping
    public ResponseEntity<List<FoodSearchResponse>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Double minKcal,
            @RequestParam(required = false) Double maxKcal,
            @RequestParam(required = false) String category
    ) {
        List<FoodSearchResponse> results = foodSearchService.search(keyword, minKcal, maxKcal, category);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/name")
    public ResponseEntity<List<FoodSearchResponse>> searchByName(@RequestParam String keyword) {
        List<FoodSearchResponse> results = foodSearchService.searchByName(keyword);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/kcal")
    public ResponseEntity<List<FoodSearchResponse>> searchByKcal(
            @RequestParam(required = false) Double min,
            @RequestParam(required = false) Double max
    ) {
        List<FoodSearchResponse> results = foodSearchService.searchByKcalRange(min, max);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/category")
    public ResponseEntity<List<FoodSearchResponse>> searchByCategory(@RequestParam String category) {
        List<FoodSearchResponse> results = foodSearchService.searchByCategory(category);
        return ResponseEntity.ok(results);
    }
}
