import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BRIDGES } from '../../data/bridges';

@Component({
    selector: 'app-bridge-detail',
    standalone: true,
    imports: [],

    template: `
    <h1>{{ bridge()?.name }}</h1>
    <p>{{ bridge()?.description }}</p>
  `,
    styleUrl: './bridge-detail.scss',
})
export class BridgeDetail {
    private route = inject(ActivatedRoute);

    bridge = computed(() => {
        const slug = this.route.snapshot.paramMap.get('slug');
        return BRIDGES.find(b => b.slug === slug) ?? null;
    });
}
