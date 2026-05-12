$urls = @(
  @{id = 2; url = "https://images.unsplash.com/photo-1556821840-3a63f15732ce?auto=format&fit=crop&w=900&q=82"; expected = "Hoodie sport" },
  @{id = 4; url = "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=900&q=82"; expected = "Soccer ball" },
  @{id = 9; url = "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=82"; expected = "Tank top" },
  @{id = 13; url = "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=900&q=82"; expected = "Jump rope" },
  @{id = 15; url = "https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?auto=format&fit=crop&w=900&q=82"; expected = "Football" },
  @{id = 21; url = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=82"; expected = "Duffel bag" },
  @{id = 22; url = "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=82"; expected = "Sports cap" },
  @{id = 23; url = "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=82"; expected = "Volleyball" },
  @{id = 25; url = "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=900&q=82"; expected = "Running shoes" },
  @{id = 27; url = "https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&w=900&q=82"; expected = "Training shirt" },
  @{id = 28; url = "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?auto=format&fit=crop&w=900&q=82"; expected = "Boxing gloves" }
)
foreach ($item in $urls) {
  try {
    $resp = Invoke-WebRequest -Uri $item.url -Method Head -TimeoutSec 10 -ErrorAction Stop
    $status = $resp.StatusCode
    $ct = $resp.Headers["Content-Type"]
    Write-Host "ID=$($item.id) [$($item.expected)]: $status | $ct"
  }
  catch {
    Write-Host "ID=$($item.id) [$($item.expected)]: FAILED - $($_.Exception.Message)"
  }
}
