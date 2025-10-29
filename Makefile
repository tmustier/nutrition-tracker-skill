.PHONY: help validate list search index extract clean

# Default target - show help
help:
	@echo "Nutrition Tracker Data Bank - Makefile Commands"
	@echo ""
	@echo "Phase 1 - Daily Workflow Commands:"
	@echo "  make validate          Validate data bank for consistency"
	@echo "  make list              List all dishes with IDs and venues"
	@echo "  make search TERM=<x>   Search for dishes by name/ingredient"
	@echo ""
	@echo "Phase 2 - Large File Commands (use when file >100KB or >50 dishes):"
	@echo "  make index             Build byte-offset index of all dishes"
	@echo "  make extract ID=<x>    Extract a single dish by ID"
	@echo "  make clean             Remove generated index files"
	@echo ""
	@echo "Examples:"
	@echo "  make search TERM=salmon"
	@echo "  make extract ID=grilled_salmon_fillet_shk_v1"
	@echo ""

# Configuration
BANK ?= data/food-data-bank.md
ID ?= example_id_v1
TERM ?=

# Phase 1: Daily Workflow Commands

validate:
	@echo "Validating $(BANK)..."
	@python3 scripts/validate_data_bank.py $(BANK)

list:
	@echo "Dishes in $(BANK):"
	@echo ""
	@grep -E "^id: [a-z0-9_]+" $(BANK) | grep -v "{stable_id}" | sed 's/id: /  - /' | sort

search:
	@if [ -z "$(TERM)" ]; then \
		echo "Error: TERM parameter required. Usage: make search TERM=salmon"; \
		exit 1; \
	fi
	@echo "Searching for '$(TERM)' in $(BANK)..."
	@echo ""
	@grep -i -B2 -A20 "$(TERM)" $(BANK) | grep -E "(^id:|^  venue:|display_name:|energy_kcal:)" | head -40

# Phase 2: Large File Commands (Index/Extract)

index:
	@echo "Building index for $(BANK)..."
	@python3 scripts/bank_build_index.py $(BANK)

extract:
	@if [ "$(ID)" = "example_id_v1" ]; then \
		echo "Error: ID parameter required. Usage: make extract ID=grilled_salmon_fillet_shk_v1"; \
		exit 1; \
	fi
	@python3 scripts/bank_extract_block.py --bank $(BANK) --id $(ID)

clean:
	@echo "Removing generated index files..."
	@rm -f $(BANK).index.json
	@echo "Done."
